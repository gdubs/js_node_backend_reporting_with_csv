## Backend API

1. Records CSV rows to a JSON file
2. Performs validations and returns row number and validation errors

## API flow

### Saving

1. Upload a csv
2. Endpoint will parse the file and will return validation errors (column specific) for re upload
3. Uploaded csv is temporarily saved on `uploaded_files` and will be deleted when done
4. If no validation errors, the data will be saved on `saved_files` directory

### Report

1. Endpoint will read from `saved_data.json` for all the requested data

## Running api

1. Do a `npm install` or `yarn install` to install dependencies
2. Run `npm start` or `yarn start` on the root folder to start the server
   a. To initiate the 1 hour interval csv post and 15 second report navigate to the `other_server` directory and execute `npm start` or `yarn start`

## Running test

1. After installing dependencies, you can navigate to the root folder and run `yarn test` or `npm test` to run the unit tests
