const exec = require('@actions/exec');
const core = require('@actions/core');

async function commitAndPush(files) {
  const repoTokenInput = core.getInput('repository-token', { required: true });
  const branchName = core.getInput('commit-branch-name', { required: false });

  core.info('Committing new badge');
  await exec.exec('git', ['config', 'user.name', `"${process.env['GITHUB_ACTOR']}"`]);
  await exec.exec('git', ['config', 'user.email', `"${process.env['GITHUB_ACTOR']}@users.noreply.github.com"`]);
  await exec.exec('git', ['remote', 'set-url', 'origin', `https://x-access-token:${repoTokenInput}@github.com/${process.env['GITHUB_REPOSITORY']}.git`]);
  await exec.exec('git', ['fetch']);
  await exec.exec('git', ['checkout', branchName]);

  for (const file of files) {
    await exec.exec('git', ['add', file]);
  }
  await exec.exec('git', ['commit', '-m', `"Updated code coverage badges`]);
  await exec.exec('git', ['push']);
  core.info('Coverage badges has been commited.');
}

module.exports = commitAndPush;
