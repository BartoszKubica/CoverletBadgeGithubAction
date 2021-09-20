import { getInput, setFailed } from '@actions/core';
import { makeBadge } from 'badge-maker';
import { existsSync, readFile, writeFile } from 'promise-fs';

async function generateBadge(badgeFilePath, labelName, coveragePercentage) {
  const minimumCoverage = parseInt(getInput('minimum-coverage', { required: true }));
  const stopOnMinimunCoveragefailure = getInput('stop-on-minimum-coverage-failure', { required: true });

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
  if (existsSync(badgeFilePath)) {
    existingBadge = (await readFile(badgeFilePath)).toString();
  }

  await writeFile(badgeFilePath, makeBadge(format));

  const generatingBadge = (await readFile(badgeFilePath)).toString();
  return generatingBadge !== existingBadge;
}

export default generateBadge;
