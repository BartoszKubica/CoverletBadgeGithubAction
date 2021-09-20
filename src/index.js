import { getInput, setFailed, info } from '@actions/core';
import parseOpenCover from './parse-xml';
import commitAndPush from './git-utils';
import generateBadge from './generate-badge';

async function run() {
  try {
    const openCoverFilePathInput = getInput('path-to-opencover-xml', { required: true });
    let badgesFilePathInput = getInput('path-to-badges', { required: false });
    if (!badgesFilePathInput) {
      badgesFilePathInput = './/';
    }

    const coverageResults = await parseOpenCover(openCoverFilePathInput);
    if (!coverageResults) {
      setFailed('No coverage results could be found');
    }

    const lineBadgePath = `${badgesFilePathInput}//coverage-badge-line.svg`.replace(/\/\/\/\//g, '//');
    const wasNewLineBadgeCreated = await generateBadge(
      lineBadgePath,
      'coverage: line',
      coverageResults.lineCoverage
    );

    const branchBadgePath = `${badgesFilePathInput}//coverage-badge-branch.svg`.replace(/\/\/\/\//g, '//');
    const wasNewBranchBadgeCreated = await generateBadge(
      branchBadgePath,
      'coverage: branch',
      coverageResults.branchCoverage
    );

    if (wasNewLineBadgeCreated || wasNewBranchBadgeCreated) {
      await commitAndPush([
        lineBadgePath,
        branchBadgePath
      ]);
    } else {
      info('No new badges were created')
    }

    info('Action successful');
  } catch (error) {
    setFailed(error.message);
  }
}

run();
