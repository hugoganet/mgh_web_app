# Unit tests

## Sequelize models tests

I have created a test for each model, testing the following:

- Creation of a new instance of the model
- Fail to create a new instance of the model with invalid data : missing required fields ; invalid data types...
- Update an instance of the model
- Delete an instance of the model

I have tested the following associations trying to think of a use case for each of them:

- belongsTo associations
- belongsToMany associations

I haven't created test files for the associations models, as they are not used directly in the application.
