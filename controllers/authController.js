const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const signin = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "userInfo": {
                    "username": foundUser.username,
                    "id": foundUser._id,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: '10min' }
        );
        const newRefreshToken = jwt.sign(
            { 
                "username": foundUser.username,
                "id": foundUser._id
             },
            process.env.REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: '1d' }
        );

        // Changed to let keyword
        let newRefreshTokenArray =
            !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {

            /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                console.log('attempted refresh token reuse at login!')
                // clear out ALL previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }

        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({ roles, accessToken, username: foundUser.username });

    } else {
        res.sendStatus(401);
    }
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); //Forbidden
                console.log('attempted refresh token reuse!')
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
                console.log(result);
            }
        )
        return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        async (err, decoded) => {
            if (err) {
                console.log('expired refresh token')
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
                return res.sendStatus(403);
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            // Refresh token was still valid
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": decoded.username,
                        "id": decoded.id,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: '10min' }
            );

            const newRefreshToken = jwt.sign(
                { 
                    "username": foundUser.username,
                    "id": foundUser._id
                 },
                process.env.REFRESH_TOKEN_SECRET_KEY,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

            res.json({ roles, accessToken })
        }
    );
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = async (req, res) => {
     // On client, also delete the accessToken

     const cookies = req.cookies;
     if (!cookies?.jwt) return res.sendStatus(204); //No content
     const refreshToken = cookies.jwt;
 
     // Is refreshToken in db?
     const foundUser = await User.findOne({ refreshToken }).exec();
     if (!foundUser) {
         res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
         return res.sendStatus(204);
     }
 
     // Delete refreshToken in db
     foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
     const result = await foundUser.save();
     console.log(result);
 
     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
     res.sendStatus(204);
}

module.exports = {
    signin,
    refresh,
    logout
}