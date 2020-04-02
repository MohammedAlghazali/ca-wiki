const {
  putSpecificCohort,
  getCohorts,
  getCohortQuery,
  deleteCohortQuery,
  postCohort,
} = require('./cohort');
const {
  addProjectQuery,
  editProjectQuery,
  deleteProject,
  getCohortProjectsQuery,
} = require('./project');

const { deleteStudentQuery } = require('./student');

module.exports = {
  postCohort,
  getCohorts,
  deleteCohortQuery,
  putSpecificCohort,
  getCohortQuery,
  addProjectQuery,
  getCohortProjectsQuery,
  editProjectQuery,
  deleteStudentQuery,
  deleteProject,
};
