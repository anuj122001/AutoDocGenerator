```markdown
# AutoDocGenerator 📝

A powerful tool that automates the generation of Markdown documentation for your GitHub projects using OpenAI's capabilities.

![License](https://img.shields.io/badge/license-MIT-brightgreen) ![Language](https://img.shields.io/badge/language-JavaScript-blue)

## Features

- Automatically generates README.md and API documentation.
- Utilizes OpenAI for enhanced documentation writing quality.
- Supports various programming languages.
- Fetches repository file structures to document the project effectively.
- Easy to set up with environment variables.

## Installation

To set up the AutoDocGenerator, you need to have Node.js installed on your machine. Then follow these instructions:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AutoDocGenerator.git
   cd AutoDocGenerator
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI and GitHub tokens:
   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   GITHUB_TOKEN=your_github_token
   ```

## Usage

To start generating documentation, run the following command with the repository you want to document:

```bash
node index.js owner/repo
```

Make sure to replace `owner/repo` with the actual GitHub repository you want to document.

## Project Structure

```plaintext
AutoDocGenerator/
├── .env
├── docGenerator.js
├── githubClient.js
└── index.js
```

## Contributing

Contributions are welcomed! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
