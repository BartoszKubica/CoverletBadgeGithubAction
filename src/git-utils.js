import { exec as _exec } from '@actions/exec';
import { getInput, info } from '@actions/core';

async function commitAndPush(files) {
  const repoTokenInput = getInput('repo-token', { required: true });
  const branchName = getInput('commit-branch-name', { required: false });

  info('Committing new badge');
  await _exec('git', ['config', 'user.name', `"${process.env['GITHUB_ACTOR']}"`]);
  await _exec('git', ['config', 'user.email', `"${process.env['GITHUB_ACTOR']}@users.noreply.github.com"`]);
  await _exec('git', ['remote', 'set-url', 'origin', `https://x-access-token:${repoTokenInput}@github.com/${process.env['GITHUB_REPOSITORY']}.git`]);
  await _exec('git', ['fetch']);
  await _exec('git', ['checkout', branchName]);

  for (const file of files) {
    await _exec('git', ['add', file]);
  }
  await _exec('git', ['commit', '-m', `"Updated code coverage badges`]);
  await _exec('git', ['push']);
  info('Coverage badges has been commited.');
}

export default commitAndPush;
