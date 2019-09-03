const makeUsersArray = () => {
    return [
        {
            id: 1,
            name: 'Melissa',
            email: 'melissa@test.com',
            password: 'password1'
        },
        {
            id: 2,
            name:'Andrew',
            email: 'andrew@test.com',
            password: 'password2'
        },
        {
            id: 3,
            name: 'Peter',
            email: 'andrew@test.com',
            password: 'password3'
        }
    ]
}

const makeProjectPatternsArray = () => {
    return [
        {
            id: 1,
            name: "Malt baby blanket",
            url: "http://tincanknits.com/pattern-SC-malt.html",
            image_url: "http://tincanknits.com/images/SC-malt-00.jpg",
            yarn: "Worsted weight",
            needles: "US 8",
            notes: "This is easy to make, but produces a refined looking blanket.",
            user_id: 1
        },
        {
            id: 2,
            name: "Toddler socks",
            url: "https://www.thesprucecrafts.com/learn-to-knit-simple-toddler-socks-4124374",
            image_url: "https://www.thesprucecrafts.com/thmb/CaQXcSjPfQMEh3-vLNPKycw-EIk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/simple-toddler-socks-56a578ba5f9b58b7d0dd176d.JPG",
            yarn: "Sport weight",
            needles: "US 4",
            notes: "Fun socks for the little ones. A little tricky with the decreases.",
            user_id: 1 
        },
        {
            id: 3,
            name: "Transverse cowl",
            url: "https://www.instructables.com/id/Transverse-Cowl-Knitting-Pattern/",
            image_url: "https://cdn.instructables.com/FRT/Y5FT/GX3LR320/FRTY5FTGX3LR320.LARGE.jpg?auto=webp&frame=1&width=325&fit=bounds",
            yarn: "Chunky weight",
            needles: "US 10",
            notes: "Easy to knit, but makes a fancy scarf.",
            user_id: 1 
        },
        {
            id: 4,
            name: "Mesh scarf",
            url: "http://knitonesmocktoo.com/2014/05/17/mesh-scarf-a-free-pattern/",
            image_url: "http://knitonesmocktoo.com/wp-content/uploads/2014/05/001-185-615x1024.jpg",
            yarn: "Lace weight",
            needles: "US 3",
            notes: "Beautiful scarf, especially with jewel-tone yarn.",
            user_id: 1 
        },
        {
            id: 5,
            name: "Simple lines baby blankets",
            url: "http://stitcheryprojects.com/2012/02/22/simple-lines-baby-blankets/",
            image_url: "http://stitcheryprojects.com/files/simplelinesblankets.jpg",
            yarn: "Worsted weight",
            needles: "US 7",
            notes: "Knits up quickly to make a cute baby blanket. Two pattern options with multiple sizes.",
            user_id: 1 
        }
    ]
}

const makeStitchPatternsArray = () => {
    return [
        {
            id: 1,
            name: "Alsacian scallops",
            url: 'https://www.knittingstitchpatterns.com/2016/09/alsacian-scallops.html',
            image_url: "https://2.bp.blogspot.com/-j6cc2TrDBoI/WCrZ3cUI80I/AAAAAAAARC8/DUaxpPr3V_0N7WMgWzXVqj15SJfes-63gCLcB/s1600/Alsacian-Scallops-lace-knit-stitch.jpg",
            notes: "Nice lace pattern. Be sure to use the right yarn weight.",
            user_id: 1
        },
        {
            id: 2,
            name: "Daisy stitch",
            url: 'https://www.knittingstitchpatterns.com/2014/08/daisy-stitch.html',
            image_url: "https://4.bp.blogspot.com/-S_HevcA4TPY/Vh5RytTPbJI/AAAAAAAAKfw/d2VdcpOXK_c/s1600/Daisy%2Bknitting%2BStitch.jpg",
            notes: "Be sure to knit loosely!!!",
            user_id: 1
        },
        {
            id: 3,
            name: "Moss stitch",
            url: 'https://www.thesprucecrafts.com/learn-about-the-moss-stitch-2117122',
            image_url: "https://www.thesprucecrafts.com/thmb/S15a_qgewRD-79DmLawG60RdbEk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/MossStitch_3-5ad11494642dca0036e38188.jpg",
            notes: "Easy reversible stitch pattern",
            user_id: 1
        },
        {
            id: 4,
            name: "Trinity stitch",
            url: 'https://www.thesprucecrafts.com/learn-about-the-trinity-stitch-2117150',
            image_url: "https://www.thesprucecrafts.com/thmb/n8p6fDI5Jg6fxBd7EGfVrmSmZE8=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/trinity-stitch-584233c95f9b5851e59e0089.JPG",
            notes: "Puffy, thick, very textured result.",
            user_id: 1
        },
        {
            id: 5,
            name: "Horseshoe lace stitch",
            url: 'https://www.thesprucecrafts.com/learn-about-the-horseshoe-lace-2116405',
            image_url: "https://www.thesprucecrafts.com/thmb/ehoz5u7dgrNd4gNl7WrW5oKXHHI=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/horseshoe-lace-56a578015f9b58b7d0dd1297.JPG",
            notes: "Beautiful despite the maybe not so beautiful name.",
            user_id: 1
        }
    ]
}

const makeMyProjectsArray = () => {
    return [
        {
            id: 1,
            name: "Peter's hat",
            image: "peters_hat.JPG",
            description: "A hat for Uncle Peter.",
            gift_recipient: "Uncle Peter",
            gift_occasion: "Just because",
            yarn: "Cascade Fibers, Superwash 220, Green Heather",
            needles: "US 8, circular",
            pattern_id: 5,
            stitches: [1, 3, 5]
        },
        {
            id: 2,
            name: "Andrew's hat",
            image: "peters_hat.JPG",
            description: "A hat for husband, dear.",
            gift_recipient: "Andrew",
            gift_occasion: "Birthday 2019",
            yarn: "Malabrigo, Rio, Azul",
            needles: "US 4, circular",
            pattern_id: 4,
            stitches: [2]
        },
        {
            id: 3,
            name: "Ada's hat",
            image: "peters_hat.JPG",
            description: "A hat for thing 1.",
            gift_recipient: "Ada",
            gift_occasion: "Holiday present 2018",
            yarn: "Cascade Fibers, Superwash 220, Carnival",
            needles: "US 7, circular",
            pattern_id: 3,
            stitches: []
        },
        {
            id: 4,
            name: "Ezzie's hat",
            image: "peters_hat.JPG",
            description: "A hat for thing 2.",
            gift_recipient: "Ezzie",
            gift_occasion: "Holiday present 2019",
            yarn: "Cascade Fibers, Superwash 220, Purple Haze",
            needles: "US 7, circular",
            pattern_id: 1,
            stitches: [3, 2]
        },
        {
            id: 5,
            name: "Baby blanket for Lena and Sergey",
            image: "peters_hat.JPG",
            description: "Blanket for their second baby, a girl.",
            gift_recipient: "Baby Abramavich",
            gift_occasion: "birth",
            yarn: "Malabrigo, Rio, Strawberry Field",
            needles: "US 7, circular",
            pattern_id: 2,
            stitches: [1, 4]
        }
    ]
}

const makeProjectStitchArray = () => {
    return [
        {
            project_id: 1,
            stitch_id: 1
        },
        {
            project_id: 1,
            stitch_id: 5
        },
        {
            project_id: 2,
            stitch_id: 1
        },
        {
            project_id: 2,
            stitch_id: 5
        },
        {
            project_id: 3,
            stitch_id: 2
        },
        {
            project_id: 3,
            stitch_id: 4
        },
        {
            project_id: 4,
            stitich_id: 6
        }
    ]
}



module.exports = {
    makeUsersArray,
    makeProjectPatternsArray,
    makeStitchPatternsArray,
    makeMyProjectsArray,
    makeProjectStitchArray
} 