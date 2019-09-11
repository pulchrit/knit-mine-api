/* Seed demo user. */
BEGIN;

/* Clear any data that is present */
TRUNCATE project_stitch, projects, stitches, patterns, users RESTART IDENTITY CASCADE;


INSERT INTO users (name, email, password)
    VALUES ('Demo', 'demo@demo.com', '$2a$12$p0bQAh5ekjQ900Eo6NfjhOYvjvavHUcdVPDyq/TjNnstV8XWPIm8q');

INSERT INTO patterns (name, url, image_url, notes, yarn, needles, user_id)
    VALUES
    ('Malt baby blanket', 'http://tincanknits.com/pattern-SC-malt.html', 'http://tincanknits.com/images/SC-malt-00.jpg', 'This is easy to make, but produces a refined looking blanket.', 'Worsted weight', 'US 8', 1),
    ('Ribbed Hat', 'https://www.allfreeknitting.com/Ribbed-Hats/Classic-Ribbed-Knit-Hat-Pattern', 'https://irepo.primecp.com/2017/06/335915/Classic-Ribbed-Knit-Hat-Pattern_Large500_ID-2294781.png?v=2294781', 'Simple ribbed hat. Knits up quickly.', 'worsted weight', 'US 6', 1),
    ('Transverse cowl', 'https://www.instructables.com/id/Transverse-Cowl-Knitting-Pattern/', 'https://cdn.instructables.com/FRT/Y5FT/GX3LR320/FRTY5FTGX3LR320.LARGE.jpg?auto=webp&frame=1&width=325&fit=bounds', 'Easy to knit, but makes a fancy scarf.', 'Chunky weight', 'US 10', 1),
    ('Mesh scarf', 'http://knitonesmocktoo.com/2014/05/17/mesh-scarf-a-free-pattern/', 'http://knitonesmocktoo.com/wp-content/uploads/2014/05/001-185-615x1024.jpg', 'Beautiful scarf, especially with jewel-tone yarn.', 'Lace weight', 'US 3', 1),
    ('Mossy Jacket', 'http://fpea.blogspot.com/2007/01/free-pattern-friday-mossy-jacket.html', 'http://farm1.static.flickr.com/134/345404969_719fcb4965.jpg', 'Will keep the little ones warm.', 'Worsted', 'US 9 and US 10', 1);

INSERT INTO stitches (name, url, image_url, notes, user_id) 
    VALUES 
    ('Rainbow feather and fan', 'https://www.knittingstitchpatterns.com/2017/09/rainbow-feather-and-fan.html', 'https://1.bp.blogspot.com/-0DP1IQa5OLM/Wbw8fhCL86I/AAAAAAAATuI/oKa72AcMXkQd2Z-qoKuxaW8g_4Z5W4R5ACLcBGAs/s1600/Rainbow-Feather-and-Fan-st.jpg', 'Ada and Ezzie will love this.', 1),
    ('Daisy stitch', 'https://www.knittingstitchpatterns.com/2014/08/daisy-stitch.html', 'https://4.bp.blogspot.com/-S_HevcA4TPY/Vh5RytTPbJI/AAAAAAAAKfw/d2VdcpOXK_c/s1600/Daisy%2Bknitting%2BStitch.jpg', 'Be sure to knit loosely', 1),
    ('Moss stitch', 'https://www.thesprucecrafts.com/learn-about-the-moss-stitch-2117122', 'https://www.thesprucecrafts.com/thmb/S15a_qgewRD-79DmLawG60RdbEk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/MossStitch_3-5ad11494642dca0036e38188.jpg', 'Easy reversible stitch pattern', 1),
    ('Ribbed stitch', 'https://www.simple-knitting.com/rib-stitch.html', 'https://www.simple-knitting.com/images/2X2RibStitch1.jpg', 'Basic ribbed stitch. Extrapolate as required.', 1),
    ('Stockinette stitch', 'https://sheepandstitch.com/library/stockinette-stitch-knitting-for-beginners/', 'https://sheepandstitch.com/wp-content/uploads/2018/12/stockinette-stitch-knitting-front-back.jpg', 'The simplest stitch. You can go so fast when working in the round.', 1);

INSERT INTO projects (name, image, description, gift_recipient, gift_occasion, yarn, needles, pattern_id, user_id)
    VALUES 
    ('Ada''s blanket', 'https://knit-mine-uploads.s3-us-west-2.amazonaws.com/Adas_blanket.jpeg', 'A blanket for little Ada.', 'Ada', 'Birth', 'Lion, Carnival, sport', 'US 7', 1, 1),
    ('Peter''s hat', 'https://knit-mine-uploads.s3-us-west-2.amazonaws.com/peters_hat.jpeg', 'A hat for Uncle Peter.', 'Uncle Peter', 'Just because', 'Lion, Jade, worsted', 'US 7', 2, 1),
    ('A hat for Andrew', 'https://knit-mine-uploads.s3-us-west-2.amazonaws.com/my_hat.jpeg', 'To keep him warm.', 'Andrew', 'Just because', 'Malabrigo, Sunset, sport', 'US 4', null, 1),
    ('Ezzie''s hat', 'https://knit-mine-uploads.s3-us-west-2.amazonaws.com/Ezzies_hat.jpeg', 'A hat for my little Ezzie bear.', 'Ezzie', 'holiday 2019', 'Cascade 220 Superwash, Spring, chunky', 'US 8', 2, 1)
    ('My scarf', 'https://knit-mine-uploads.s3-us-west-2.amazonaws.com/scarf.jpeg', 'My neck is cold.', 'me', 'just because', 'Mirasol Sulka, Peppermit, Chunky', 'US 14', 4, 1);

INSERT INTO project_stitch (project_id, stitch_id)
    VALUES
    (1, 3),
    (1, 5),
    (2, 4),
    (3, 4),
    (3, 5),
    (4, 4),
    (5, 5);

COMMIT;  