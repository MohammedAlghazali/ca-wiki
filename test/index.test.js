const request = require('supertest');
const connection = require('../server/database/config/connection');
const dbBuild = require('../server/database/config/build');

const app = require('../server/app');

beforeEach(() => dbBuild());

afterAll(() => connection.end());

describe('Get all Cohorts', () => {
  test('Route /cohorts status 200, json header, data', (done) => {
    return request(app)
      .get('/api/v1/cohorts')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        const { data } = res.body;
        expect(data).toHaveLength(2);
        done();
      });
  });
});

describe('Get Specific Cohort', () => {
  test('Route /cohorts/1 status 200, json header, data.name =G8 ', (done) => {
    return request(app)
      .get('/api/v1/cohorts/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        const { data } = res.body;
        expect(data.name).toBe('G8');
        done();
      });
  });

  test('Route /cohorts/10 status 404, json header, data.message = "Sorry There\'s no cohort for this id" ', (done) => {
    return request(app)
      .get('/api/v1/cohorts/10')
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        const { message } = res.body;
        expect(message).toBe("Sorry There's no cohort for this id");
        done();
      });
  });
});

describe('Post Cohort', () => {
  const data = {
    name: 'G1',
    description: 'Code GazaSkyGeeksAcademy, 1st Cohort',
    imgUrl: 'https://avatars0.githubusercontent.com/u/59821022?s=200&v=4',
    githubLink: 'https://github.com/GSG-G1',
  };
  const wrongData = {
    name: 'G2',
    description: 'Code GazaSkyGeeksAcademy, 2nd Cohort',
    imgUrl: 'This is cohort Image',
    githubLink: 'https://github.com/GSG-G1',
  };

  test('PUT Route /cohorts/1 status 200, json header, send data ', (done) => {
    return request(app)
      .put('/api/v1/cohorts/1')
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) return done(err);
        const { message } = res.body;
        const { rows } = await connection.query(
          'SELECT * from cohort WHERE id = 1',
        );
        expect(message).toBe('Changed Succefully');
        expect(rows).toHaveLength(1);
        expect(rows[0]).toEqual({
          id: 1,
          name: 'G1',
          description: 'Code GazaSkyGeeksAcademy, 1st Cohort',
          img_url:
            'https://avatars0.githubusercontent.com/u/59821022?s=200&v=4',
          github_link: 'https://github.com/GSG-G1',
        });
        done();
      });
  });

  test('PUT Route /cohorts/4 status 404, json header, send data ', (done) => {
    return request(app)
      .put('/api/v1/cohorts/4')
      .send(data)
      .expect(404)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) return done(err);
        const { message } = res.body;
        const { rows } = await connection.query(
          'SELECT * from cohort WHERE id = 4',
        );
        expect(message).toBe("Sorry There's no cohort for this id to change");
        expect(rows).toHaveLength(0);
        done();
      });
  });

  test('PUT Route /cohorts/1 status 400, json header, send wrong data and test the received message', (done) => {
    return request(app)
      .put('/api/v1/cohorts/1')
      .send(wrongData)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) return done(err);
        const { message } = res.body;
        await connection.query('SELECT * from cohort WHERE id = 1');
        expect(message[0]).toBe('imgUrl must be a valid URL');
        done();
      });
  });
});

describe('Admin, (/cohorts/:cohortId)', () => {
  test('Route /cohorts/1 status 200, data.message = Cohort deleted successfully ', (done) => {
    return request(app)
      .delete('/api/v1/cohorts/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        const { message } = res.body.data;
        if (err) return done(err);
        const { rows } = await connection.query(
          'SELECT * from cohort WHERE id = 1',
        );
        expect(rows).toHaveLength(0);
        expect(message).toBe('Cohort deleted successfully');
        done();
      });
  });
});

describe('Admin, Post Project', () => {
  test('Route /projects status 200, json header, data.message = Cohort Added successfully ', (done) => {
    const reqData = {
      name: 'Mohmmedzw851@',
      description: 'description',
      imgUrl: 'https://avatars3.githubusercontent.com/u/52123464?s=200&v=4',
      githubLink: 'https://avatars3.githubusercontent.com/u/52123464?s=200&v=4',
      websiteLink:
        'https://avatars3.githubusercontent.com/u/52123464?s=200&v=4',
      projectType: 'internal',
      cohortId: '1',
    };
    return request(app)
      .post('/api/v1/projects')
      .send(reqData)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        const { message } = res.body.data;
        if (err) return done(err);
        const { rows } = await connection.query(
          'SELECT * from project WHERE id = 6',
        );
        expect(rows[0].name).toBe('Mohmmedzw851@');
        expect(message).toBe('Project Added successfully');
        done();
      });
  });
});

describe('Admin, Delete Specific Cohort', () => {
  test('Route /cohorts/1 status 200, data.message = Cohort deleted successfully ', (done) => {
    return request(app)
      .delete('/api/v1/cohorts/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        const { message } = res.body.data;
        if (err) return done(err);
        const { rows } = await connection.query(
          'SELECT * from cohort WHERE id = 1',
        );
        expect(rows).toHaveLength(0);
        expect(message).toBe('Cohort deleted successfully');
        done();
      });
  });
});

describe('Admin, (/projects/:projectId)', () => {
  test('PUT Route /projects/1 status 200, json header, message:Cohort updated successfully', (done) => {
    const testData = {
      name: 'Mooooot',
      description: 'project test',
      imgUrl: 'https://github.com/GSG-G1',
      githubLink: 'https://github.com/GSG-G1',
      websiteLink: 'https://github.com/GSG-G1',
      projectType: 'remotely',
      cohortId: '2',
    };
    return request(app)
      .put('/api/v1/projects/5')
      .send(testData)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) return done(err);
        const { message } = res.body.data;
        expect(message).toBe('project updated successfully');
        done();
      });
  });
});

describe('Delete specific student by ID', () => {
  test('Route /alumni/1 status 200, data.message = Student deleted successfully ', (done) => {
    return request(app)
      .delete('/api/v1/alumni/1')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        const { message } = res.body.data;
        if (err) return done(err);
        const { rows } = await connection.query(
          'SELECT * from student WHERE id = 1',
        );
        expect(rows).toHaveLength(0);
        expect(message).toBe('Student deleted successfully');
        done();
      });
  });

  test('Route /alumni/10 status 404, data.message = Student does not exist ', (done) => {
    return request(app)
      .delete('/api/v1/alumni/10')
      .expect(404)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        const { message } = res.body.data;
        if (err) return done(err);
        expect(message).toBe('Student does not exist');
        done();
      });
  });

  test('Route /alumni/Alaa status 404, data.message = You enterd wrong student ID ', (done) => {
    return request(app)
      .delete('/api/v1/alumni/Alaa')
      .expect(404)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        const { message } = res.body.data;
        if (err) return done(err);
        expect(message).toBe('You enterd wrong student ID');
        done();
      });
  });
});

describe('Admin, Put project', () => {
  const validData = {
    name: 'Rehab',
    email: 'rehab@gmail.com',
    imgUrl: 'https://avatars3.githubusercontent.com/u/49806841?s=460&v=4',
    githubLink: 'https://github.com/rehabas',
    cohortId: 1,
  };
  const invalidData = {
    name: 'Rehab',
    email: 'email',
    imgUrl: 'img url',
    githubLink: 'github link',
    cohortId: 1,
  };

  test('PUT Route /alumni/1 status 200, json header, put data ', (done) => {
    request(app)
      .put('/api/v1/alumni/1')
      .send(validData)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) return done(err);
        const {
          data: { message },
        } = res.body;
        const { rows } = await connection.query(
          'SELECT * from student WHERE id = 1',
        );
        expect(rows).toHaveLength(1);
        expect(rows[0]).toEqual({
          id: 1,
          name: 'Rehab',
          email: 'rehab@gmail.com',
          img_url:
            'https://avatars3.githubusercontent.com/u/49806841?s=460&v=4',
          github_link: 'https://github.com/rehabas',
          cohort_id: 1,
        });
        expect(message).toBe("Student's data updated successfully");
        done();
      });
  });

  test('PUT Route /alumni/11 status 404, json header, put data ', (done) => {
    request(app)
      .put('/api/v1/alumni/11')
      .send(validData)
      .expect(404)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) return done(err);
        const {
          data: { message },
        } = res.body;
        const { rows } = await connection.query(
          'SELECT * from student WHERE id = 11',
        );
        expect(rows).toHaveLength(0);
        expect(message).toBe('There is no student for this id');
        done();
      });
  });

  test('PUT Route /alumni/1 status 400, json header, put invalid data ', (done) => {
    request(app)
      .put('/api/v1/alumni/1')
      .send(invalidData)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(async (err, res) => {
        if (err) return done(err);
        const {
          data: { message },
        } = res.body;
        await connection.query('SELECT * from student WHERE id = 1');
        expect(message).toEqual([
          'email must be a valid email',
          'imgUrl must be a valid URL',
          'githubLink must be a valid URL',
        ]);
        done();
      });
  });
});
