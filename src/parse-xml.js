import Parser from 'xml2js-parser';
import { readFile } from 'promise-fs';

const parseOpenCover = async function(filepath) {
  const content = await readFile(filepath);
  if (content.length > 0) {
    const parser = new Parser({});
    const result = await parser.parseString(content);
    if (result && result.CoverageSession && result.CoverageSession.Summary) {
      // we have an open cover xml file, retrieve the appropriate properties
      const lineCoverage = result.CoverageSession.Summary[0]['$'].sequenceCoverage;
      const branchCoverage = result.CoverageSession.Summary[0]['$'].branchCoverage;
      return { lineCoverage, branchCoverage };
    }
  }

  return null;
}

export default parseOpenCover;
