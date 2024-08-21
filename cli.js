#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { execSync } from "child_process";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define colors
const instructions = chalk.blue.bold(`
  Instructions:
  - Use SPACE to select multiple options
  - Press ENTER to proceed to the next step
  - 'None' is the default option for no selection
`);

const famousLibraryColor = chalk.green.bold;
const noneColor = chalk.red.bold;

// Define the initial instruction question
const instructionQuestion = {
  type: "input",
  name: "instructions",
  message: `Please read the instructions below and press ENTER to continue:\n\n${instructions}`,
  default: "",
};

// Define questions for user input
const questions = [
  {
    type: "input",
    name: "projectName",
    message: "Enter the name of your project:",
    validate: (input) => (input ? true : "Project name cannot be empty."),
  },
  {
    type: "checkbox",
    name: "uiLibraries",
    message: `Select UI libraries (or press Enter to skip):\n`,
    choices: [
      { name: famousLibraryColor("MUI"), value: "MUI" },
      { name: famousLibraryColor("Chakra UI"), value: "Chakra UI" },
      { name: famousLibraryColor("Ant Design"), value: "Ant Design" },
      { name: noneColor("None"), value: "None" },
      { name: "Bootstrap", value: "Bootstrap" },
      { name: "Semantic UI React", value: "Semantic UI React" },
      { name: "Tailwind CSS", value: "Tailwind CSS" },
      { name: "Blueprint", value: "Blueprint" },
      { name: "Evergreen", value: "Evergreen" },
    ],
    default: [],
  },
  {
    type: "checkbox",
    name: "stateManagement",
    message: `Select state management libraries (or press Enter to skip):\n`,
    choices: [
      { name: famousLibraryColor("Redux"), value: "Redux" },
      { name: "Zustand", value: "Zustand" },
      { name: "Recoil", value: "Recoil" },
      { name: "MobX", value: "MobX" },
      { name: noneColor("None"), value: "None" },
      { name: "XState", value: "XState" },
      { name: "Jotai", value: "Jotai" },
      { name: "React Query", value: "React Query" },
      { name: "Apollo Client", value: "Apollo Client" },
    ],
    default: [],
  },
  {
    type: "checkbox",
    name: "commonLibraries",
    message: `Select commonly used libraries (or press Enter to skip):\n`,
    choices: [
      { name: famousLibraryColor("Axios (HTTP client)"), value: "axios" },
      {
        name: famousLibraryColor("React Router DOM (Routing)"),
        value: "react-router-dom",
      },
      { name: "Lodash (Utility functions)", value: "lodash" },
      { name: noneColor("None"), value: "None" },
      { name: "Moment (Date manipulation)", value: "moment" },
      { name: "React Hook Form (Form handling)", value: "react-hook-form" },
      { name: "Formik (Form handling)", value: "formik" },
      { name: "Yup (Validation)", value: "yup" },
      {
        name: "Classnames (Conditionally add class names)",
        value: "classnames",
      },
    ],
    default: [],
  },
];

const updateAppFile = (projectName, targetPath) => {
  const appFilePath = path.join(targetPath, "src", "App.jsx");
  let appFileContent = fs.readFileSync(appFilePath, "utf8");

  // Only replace the text inside the div with the project name
  appFileContent = appFileContent.replace(
    /<div className='main'>.*<\/div>/,
    `<div className='main'>${projectName}</div>`
  );

  fs.writeFileSync(appFilePath, appFileContent, "utf8");
};

const runCLI = async () => {
  console.log(
    chalk.bold.cyanBright(`
  ===================================
  ||                              ||
  ||      Welcome to React CLI    ||
  ||       Developed by Vedant    ||
  ||                              ||
  ===================================

  `)
  );
  // Display instructions
  await inquirer.prompt(instructionQuestion);

  // Prompt user for project details and library selections
  const answers = await inquirer.prompt(questions);
  const { projectName, uiLibraries, stateManagement, commonLibraries } =
    answers;

  console.log(chalk.green(`\nCreating project: ${projectName}...`));

  // Create project directory
  const projectDir = path.join(process.cwd(), projectName);
  fs.ensureDirSync(projectDir);

  // Copy boilerplate files
  const templatePath = path.join(__dirname, "main");
  fs.copySync(templatePath, projectDir, { overwrite: true });

  // Update App.jsx with project name
  updateAppFile(projectName, projectDir);

  // Update package.json
  const packageJsonPath = path.join(projectDir, "package.json");
  const packageJson = fs.readJsonSync(packageJsonPath);
  packageJson.name = projectName;

  // Add selected libraries to dependencies
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  if (uiLibraries.length && !uiLibraries.includes("None")) {
    uiLibraries.forEach((lib) => {
      switch (lib) {
        case "MUI":
          packageJson.dependencies["@mui/material"] = "^5.14.11";
          packageJson.dependencies["@emotion/react"] = "^11.11.1";
          packageJson.dependencies["@emotion/styled"] = "^11.11.0";
          break;
        case "Chakra UI":
          packageJson.dependencies["@chakra-ui/react"] = "^2.7.2";
          packageJson.dependencies["@emotion/react"] = "^11.11.1";
          packageJson.dependencies["@emotion/styled"] = "^11.11.0";
          break;
        case "Ant Design":
          packageJson.dependencies["antd"] = "^5.9.1";
          break;
        case "Bootstrap":
          packageJson.dependencies["bootstrap"] = "^5.3.1";
          break;
        case "Tailwind CSS":
          packageJson.dependencies["tailwindcss"] = "^3.3.3";
          break;
      }
    });
  }

  if (stateManagement.length && !stateManagement.includes("None")) {
    stateManagement.forEach((lib) => {
      switch (lib) {
        case "Redux":
          packageJson.dependencies["redux"] = "^4.2.1";
          packageJson.dependencies["react-redux"] = "^8.1.1";
          break;
        case "Zustand":
          packageJson.dependencies["zustand"] = "^4.4.0";
          break;
        case "Recoil":
          packageJson.dependencies["recoil"] = "^0.7.7";
          break;
        case "MobX":
          packageJson.dependencies["mobx"] = "^6.10.2";
          packageJson.dependencies["mobx-react"] = "^7.6.0";
          break;
        case "React Query":
          packageJson.dependencies["react-query"] = "^3.39.3";
          break;
      }
    });
  }

  if (commonLibraries.length && !commonLibraries.includes("None")) {
    commonLibraries.forEach((lib) => {
      switch (lib) {
        case "axios":
          packageJson.dependencies["axios"] = "^1.7.4";
          break;
        case "react-router-dom":
          packageJson.dependencies["react-router-dom"] = "^6.26.1";
          break;
        case "lodash":
          packageJson.dependencies["lodash"] = "^4.17.21";
          break;
        case "moment":
          packageJson.dependencies["moment"] = "^2.29.4";
          break;
        case "react-hook-form":
          packageJson.dependencies["react-hook-form"] = "^7.45.1";
          break;
        case "formik":
          packageJson.dependencies["formik"] = "^2.4.2";
          break;
        case "yup":
          packageJson.dependencies["yup"] = "^1.2.0";
          break;
        case "classnames":
          packageJson.dependencies["classnames"] = "^2.3.2";
          break;
      }
    });
  }

  fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

  // Install dependencies
  console.log(chalk.green("\nInstalling dependencies..."));
  try {
    execSync("npm install", { cwd: projectDir, stdio: "inherit" });
    console.log(chalk.green("Dependencies installed successfully!"));
  } catch (error) {
    console.error(chalk.red("Error installing dependencies."));
  }

  console.log(
    chalk.green(`\nProject ${projectName} created and setup completed!`)
  );

  console.log(
    chalk.green(`\n Go to project directory and run: npm run dev - to start the project`)
  );
};

runCLI();
