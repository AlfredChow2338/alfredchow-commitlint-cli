// const matchCommitMessageType = /(.+?):/ // everything before (eg. feat: )
// const matchJiraId = /\s(BIG-[0-9]+)/ // JIRA id (eg. BIG-15850)
// const matchSubject = /\s([a-zA-Z0-9_ ]+)/ // Everything after

module.exports = {
	parserPreset: {
		parserOpts: {},
	},
	plugins: [
		{
			rules: {
				'match-bookmyshow-commit': (parsed, _, matchedTypeObject) => {
					const {type, subject, raw} = parsed;

					const overrideSuccess = '! will override the commitlint.';
					const success =
						'✅​ Type ✅ JIRA ID ✅​ Subject \n​ Commit succeed!​';
					const incompleteError =
						'Type, JIRA ID and subject must be included.\neg. feat: BIG-15850 add commitlint\neg. fix: BIG-15608 update logic for ticket purchases\n';
					const typeError =
						'Only the following types are allowed (case-sensitive):\n' +
						Object.keys(matchedTypeObject)
							.map((key) => `'${key}' for ${matchedTypeObject[key]}`)
							.join('\n')
							.concat('\n');

					const jiraMissingError = `Type 'feat' and 'fix' must include JIRA ID (BIG-XXXXX). \n`;

					const isFeatOrFix = ['feat', 'fix'].includes(type);

					if (raw.includes('!')) {
						return [true, overrideSuccess];
					}

					if (raw.substring(0, 5) === 'Merge') {
						return [true, success];
					}

					if (type === null || subject === null) {
						return [false, incompleteError];
					}

					if (!matchedTypeObject[type]) {
						return [false, typeError];
					}

					if (isFeatOrFix && subject.substring(0, 4) !== 'BIG-') {
						return [false, jiraMissingError];
					}

					return [true, success];
				},
			},
		},
	],
	rules: {
		'match-bookmyshow-commit': [
			2,
			'always',
			{
				feat: '🚀 A new feature',
				fix: '🐞​ A bug fix',
				chore: "🧹​ Other changes that don't modify src",
				build: '​⛏️​  Update dependency',
				minor: '🧼​ Log removal, comment clearance',
				revert: '🔙​ Revert changes',
			},
		],
	},
};
