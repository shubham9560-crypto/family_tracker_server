const express = require("express");

const User = require('./models/user.models.js');
const Family = require('./models/family.models.js');
const connectDb = require('./db.js');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Server is running...")
});

// this api request for familyCode as email and name and profileImg and lat and lon
app.post("/family/create", async (req, res) => {
    try {

        const email = req.body.email;
        // Create family
        const newFamily = await Family.create({
            familyCode: email,
            members: []
        });
        console.log("Family Created", newFamily);

        const user = await User.create({
            name: req.body.name,
            email: email,
            profileImg: "",
            location: {
                type: "Point",
                coordinates: [0, 0] //default coordinate
            }
        })
        res.status(201).json({
            "family": newFamily,
            "user": user
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// use for joining an existing family so this requires family code which is a email and userid
app.post("/family/join", async (req, res) => {
    console.log("Incoming data: ", req.body.familyCode, req.body.userId)
    try {
        // searching family in database using family code
        const family = await Family.findOne({
            familyCode: req.body.familyCode
        });



        if (!family) {
            return res.status(404).json({
                message: "Family not found"
            })
        }

        console.log("family found")

        //check if user exist in user class not in family class
        // 2. Find existing user
        const user = await User.findOne({ email: req.body.userId });
        console.log(user)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        console.log("joining request found")
        // 3. Check if user is already a member
        const alreadyMember = family.members.some(
            memberId => {
                console.log(memberId.toString(), user._id.toString())
                return memberId.toString() === user._id.toString();
            }
        );

        if (alreadyMember) {
            return res.status(400).json({
                message: "User already belongs to this family"
            });
        }

        // const user = await User.create({
        //     name: req.body.name,
        //     profileImg: req.body.imageUrl,
        //     location: {
        //         type: "Point",
        //         coordinates: [req.body.lat, req.body.lon]
        //     }
        // })


        family.members.push(user._id);

        await family.save();

        res.status(200).json({ message: "User joined family successfully" });

    }

    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});

//update coordinates API
app.patch("/user/location", async (req, res) => {
    try {

        const { userId, lat, lon,speed,heading } = req.body;
        const user = await User.findByIdAndUpdate(userId, {
            location: {
                type: "Point",
                coordinates: [lon, lat]

            },
            heading:heading,
            speed:speed,
            lastUpdated: new Date()

        },

            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(201).json({
            message: "Location Updated"
        })

    }
    catch (err) {
        res.status(404).json({
            message: "User not found"
        })
    }
})



// fetch coordinates
app.get("/family/:familyCode", async (req, res) => {
    try {
        const family = await Family.findOne({
            familyCode: req.params.familyCode
        }).populate("members");

        if (!family) {
            return res.status(404).json({
                message: "Family not found"
            });
        }

        res.json(family.members);
    }
    catch (err) {
        res.status(500).json({
            message: error.message
        });

    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server started");

    connectDb()
})