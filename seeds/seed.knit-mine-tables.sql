/* Seed data for development. */
BEGIN;
/* Clear any data that is present */
TRUNCATE project_stitch, projects, stitches, patterns, users RESTART IDENTITY CASCADE;


INSERT INTO users (name, email, password )
    VALUES
    ('Melissa', 'melissa@test.com', '$2a$12$Ht774E8oeomguUDR3pcqhuAMnJ1SX9xit1wAhm8nWt3YBLRywojQy'),
    ('Andrew', 'andrew@test.com', '$2a$12$NotzS9q1rCFDp3R9TNmgS.wZCGJmDd7YJXO56jfbYCme/RuBsjdBi'),
    ('Peter', 'peter@test.com', '$2a$12$sgLsr2ZwYMTE7gvl5755NO1s8zPl6LAPxpaKcCMRButs6VE1e4MW6');

INSERT INTO patterns (name, url, image_url, notes, yarn, needles, user_id)
    VALUES
    ('Malt baby blanket', 'http://tincanknits.com/pattern-SC-malt.html', 'http://tincanknits.com/images/SC-malt-00.jpg', 'This is easy to make, but produces a refined looking blanket.', 'Worsted weight', 'US 8', 1),
    ('Toddler socks', 'https://www.thesprucecrafts.com/learn-to-knit-simple-toddler-socks-4124374', 'https://www.thesprucecrafts.com/thmb/CaQXcSjPfQMEh3-vLNPKycw-EIk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/simple-toddler-socks-56a578ba5f9b58b7d0dd176d.JPG', 'Fun socks for the little ones. A little tricky with the decreases.', 'Sport weight', 'US 4', 2),
    ('Transverse cowl', 'https://www.instructables.com/id/Transverse-Cowl-Knitting-Pattern/', 'https://cdn.instructables.com/FRT/Y5FT/GX3LR320/FRTY5FTGX3LR320.LARGE.jpg?auto=webp&frame=1&width=325&fit=bounds', 'Easy to knit, but makes a fancy scarf.', 'Chunky weight', 'US 10', 3),
    ('Transverse cowl', 'https://www.instructables.com/id/Transverse-Cowl-Knitting-Pattern/', 'https://cdn.instructables.com/FRT/Y5FT/GX3LR320/FRTY5FTGX3LR320.LARGE.jpg?auto=webp&frame=1&width=325&fit=bounds', 'I will make this for Mother.', 'Chunky weight', 'US 10', 2),
    ('Mesh scarf', 'http://knitonesmocktoo.com/2014/05/17/mesh-scarf-a-free-pattern/', 'http://knitonesmocktoo.com/wp-content/uploads/2014/05/001-185-615x1024.jpg', 'Beautiful scarf, especially with jewel-tone yarn.', 'Lace weight', 'US 3', 1),
    ('Simple lines baby blankets', 'http://stitcheryprojects.com/2012/02/22/simple-lines-baby-blankets/', 'http://stitcheryprojects.com/files/simplelinesblankets.jpg', 'Knits up quickly to make a cute baby blanket. Two pattern options with multiple sizes.', 'Worsted weight','US 7', 3),
    ('Mesh scarf', 'http://knitonesmocktoo.com/2014/05/17/mesh-scarf-a-free-pattern/', 'http://knitonesmocktoo.com/wp-content/uploads/2014/05/001-185-615x1024.jpg', 'Make several for the holidays.', 'Lace weight', 'US 3', 3);

INSERT INTO stitches (name, url, image_url, notes, user_id) 
    VALUES 
    ('Alsacian scallops', 'https://www.knittingstitchpatterns.com/2016/09/alsacian-scallops.html', 'https://2.bp.blogspot.com/-j6cc2TrDBoI/WCrZ3cUI80I/AAAAAAAARC8/DUaxpPr3V_0N7WMgWzXVqj15SJfes-63gCLcB/s1600/Alsacian-Scallops-lace-knit-stitch.jpg', 'Nice lace pattern. Be sure to use the right yarn weight.', 1),
    ('Alsacian scallops', 'https://www.knittingstitchpatterns.com/2016/09/alsacian-scallops.html', 'https://2.bp.blogspot.com/-j6cc2TrDBoI/WCrZ3cUI80I/AAAAAAAARC8/DUaxpPr3V_0N7WMgWzXVqj15SJfes-63gCLcB/s1600/Alsacian-Scallops-lace-knit-stitch.jpg', 'Make this for my dearest wife.', 2),
    ('Daisy stitch', 'https://www.knittingstitchpatterns.com/2014/08/daisy-stitch.html', 'https://4.bp.blogspot.com/-S_HevcA4TPY/Vh5RytTPbJI/AAAAAAAAKfw/d2VdcpOXK_c/s1600/Daisy%2Bknitting%2BStitch.jpg', 'Be sure to knit loosely!!!', 3),
    ('Moss stitch', 'https://www.thesprucecrafts.com/learn-about-the-moss-stitch-2117122', 'https://www.thesprucecrafts.com/thmb/S15a_qgewRD-79DmLawG60RdbEk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/MossStitch_3-5ad11494642dca0036e38188.jpg', 'Easy reversible stitch pattern', 2),
    ('Moss stitch', 'https://www.thesprucecrafts.com/learn-about-the-moss-stitch-2117122', null, 'Couldn''t find link to image, but this is a really cool stitch. Very easy and doesn''t curl.', 1),
    ('Trinity stitch', 'https://www.thesprucecrafts.com/learn-about-the-trinity-stitch-2117150', 'https://www.thesprucecrafts.com/thmb/n8p6fDI5Jg6fxBd7EGfVrmSmZE8=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/trinity-stitch-584233c95f9b5851e59e0089.JPG', 'Puffy, thick, very textured result.', 3),
    ('Horseshoe lace stitch', 'https://www.thesprucecrafts.com/learn-about-the-horseshoe-lace-2116405', 'https://www.thesprucecrafts.com/thmb/ehoz5u7dgrNd4gNl7WrW5oKXHHI=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/horseshoe-lace-56a578015f9b58b7d0dd1297.JPG', 'Beautiful despite the maybe not so beautiful name.', 1);

INSERT INTO projects (name, image, description, gift_recipient, gift_occasion, yarn, needles, pattern_id, user_id)
    VALUES 
    ('Ada''s blanket', null, 'A blanket for little Ada.', 'Ada', 'Birth', 'Lion, Carnival', 'US 7', 1, 1),
    ('A hat for me', null, 'I made this hat to keep my head warm.', 'Me', 'just because', 'Malabrigo, Sunset', 'US 4', null, 2),
    ('Ezzie''s hat', null, 'A hat for my little Ezzie bear.', 'Ezzie', 'holiday 2019', 'Cascade 220 Superwash, Spring', 'US 6', null, 3);

INSERT INTO project_stitch (project_id, stitch_id)
    VALUES
    (1, 1),
    (1, 5),
    (2, 2),
    (2, 4),
    (3, 6);

COMMIT;   
  
  