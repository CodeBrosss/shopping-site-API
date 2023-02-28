const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send(
        "<h2>Yo what's up?</h2> <h3>I'm just a shopping website REST API hosted here all alone with no frontend, my creator plans on giving me a frontend as soon as he learns reactJS. If you have a frontend for me, check this documentation for how i'm used</h3> => https://docs.google.com/document/d/1QQ4SvOgUYSjFfYY-iZz7_7BaGae908HDgzVSrc7yIxw/edit?usp=sharing <h3>And here's my code</h3> => https://github.com/Ikem-coded-it/shopping-site-API"
    );
})

module.exports = router;