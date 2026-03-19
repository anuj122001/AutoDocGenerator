# API Documentation — AutoDocGenerator

## Overview
AutoDocGenerator is a Node.js application that utilizes the OpenAI API to automatically generate README and API documentation for GitHub repositories. With the help of the GitHub API, it retrieves the structure and contents of code files, and generates professional documentation in Markdown format.

---

## File: `docGenerator.js`

### Function: `generateDocs(repo, fileContents)`
Generates a README.md file using the OpenAI API based on provided repository details.

- **Parameters**
  - `repo` (string): The GitHub repository in the format `owner/repo`.
  - `fileContents` (Array): An array of objects containing file paths and their contents.
  
- **Return Value**
  - Promises a string that contains the generated README.md content.

- **Example Usage**
  ```javascript
  const docs = await generateDocs("owner/repo", fileContents);
  ```

---

## File: `githubClient.js`

### Function: `getHeaders()`
Constructs and returns the necessary headers for GitHub API requests.

- **Parameters**
  - None

- **Return Value**
  - An object containing headers including Authorization and Accept.

- **Example Usage**
  ```javascript
  const headers = getHeaders();
  ```

### Function: `fetchRepoFiles(repo)`
Fetches the list of files in a given GitHub repository.

- **Parameters**
  - `repo` (string): The GitHub repository in the format `owner/repo`.

- **Return Value**
  - An array of file objects representing the files in the repository.

- **Example Usage**
  ```javascript
  const files = await fetchRepoFiles("owner/repo");
  ```

### Function: `getFileContent(repo, filePath)`
Retrieves the content of a specific file in the given GitHub repository.

- **Parameters**
  - `repo` (string): The GitHub repository in the format `owner/repo`.
  - `filePath` (string): The path of the file within the repository.

- **Return Value**
  - The content of the file as a string, or `null` if the file could not be retrieved.

- **Example Usage**
  ```javascript
  const content = await getFileContent("owner/repo", "path/to/file.js");
  ```

### Function: `pushFilesToRepo(repo, files)`
Pushes the specified files to the given GitHub repository.

- **Parameters**
  - `repo` (string): The GitHub repository in the format `owner/repo`.
  - `files` (Array): An array of objects representing the files to be pushed.

- **Return Value**
  - A promise indicating the success or failure of the push operation.

- **Example Usage**
  ```javascript
  await pushFilesToRepo("owner/repo", files);
  ```

---

## File: `index.js`

### Function: `run()`
Main execution flow for fetching repository files and generating documentation.

- **Parameters**
  - None

- **Return Value**
  - Executes the process as defined (not a return function).

- **Example Usage**
  ```javascript
  run();
  ```

---

## Environment Variables
The following environment variables are utilized within the AutoDocGenerator application:

- `OPENAI_API_KEY`: The API key for authenticating with OpenAI.
- `GITHUB_TOKEN`: The token for authenticating with the GitHub API.

Ensure that these variables are defined in a `.env` file within the project root.

---

## Error Handling Notes
The application contains error handling mechanisms to manage possible issues, including:

1. Missing environment variables: The application checks for `OPENAI_API_KEY` and `GITHUB_TOKEN`, and exits with an error message if either is absent.
2. GitHub API errors: If API requests fail, an error is thrown detailing the response status and message.
3. Unsupported files: The script only processes certain file types, and will give feedback if none are found or if an error occurs while fetching file content.

--- 

This documentation serves as a guide for developers working with the AutoDocGenerator project. It outlines key functionalities, parameters, return values, and error handling considerations, ensuring a smooth implementation and usage experience.