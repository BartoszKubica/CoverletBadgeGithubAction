const core = require('@actions/core');
const { makeBadge } = require('badge-maker')
const fs = require('promise-fs');


async function generateBadge(badgeFilePath, labelName, coveragePercentage) {
  const minimumCoverage = parseInt(core.getInput('minimum-coverage', { required: true }));
  const stopOnMinimunCoveragefailure = core.getInput('stop-on-minimum-coverage-failure', { required: true });

  if(stopOnMinimunCoveragefailure === 'true'){
    setFailed("Minimum code coverage is not reached");
  }

  let color = 'green';
  if (coveragePercentage < minimumCoverage) {
    color = 'red';
  }

  const format = {
    label: labelName,
    message: `${coveragePercentage}%`,
    color: color,
    style: 'flat',
  };

  let existingBadge = '';
  if (fs.existsSync(badgeFilePath)) {
    existingBadge = (await fs.readFile(badgeFilePath)).toString();
  }

  await fs.writeFile(badgeFilePath, makeBadge(format));

  const generatingBadge = (await fs.readFile(badgeFilePath)).toString();
  return generatingBadge !== existingBadge;
}

module.exports = generateBadge;
