CREATE TABLE project_stitch (
    project_id INTEGER REFERENCES projects(id)
    stitch_id INTEGER REFERENCES stitches(id)
    PRIMARY KEY (project_id, stitch_id)
);