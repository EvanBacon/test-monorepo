// From @byCedric https://github.com/expo/expo-github-action/blob/main/.releaserc.js

const rules = [
  { type: "feat", release: "minor", title: "New features" },
  { type: "feature", release: "minor", title: "New features" },
  { type: "fix", release: "patch", title: "Bug fixes" },
  { type: "refactor", release: "patch", title: "Code changes" },
  { type: "chore", release: "patch", title: "Other chores" },
  { type: "docs", release: "patch", title: "Documentation changes" },
];

// Simple mapping to order the commit groups
const sortMap = Object.fromEntries(
  rules.map((rule, index) => [rule.title, index])
);

module.exports = {
  branches: [
    "+([0-9])?(.{+([0-9]),x}).x",
    "main",
    "next",
    "next-major",
    {
      name: "beta",
      prerelease: true,
    },
    {
      name: "alpha",
      prerelease: true,
    },
  ],
  tagFormat: "${version}",
  repositoryUrl: "https://github.com/EvanBacon/test-monorepo.git",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { breaking: true, release: "major" },
          { revert: true, release: "patch" },
        ].concat(
          rules.map(({ type, release, breaking }) => ({
            type,
            release,
            breaking,
          }))
        ),
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: rules.map(({ type, title }) => ({ type, section: title })),
        },
        writerOpts: {
          commitGroupsSort: (a, z) => sortMap[a.title] - sortMap[z.title],
        },
      },
    ],
    "@semantic-release/changelog",
    [
      "@semantic-release/git",
      {
        message: "chore: ${nextRelease.version}\n\n${nextRelease.notes}",
        assets: ["package.json", "CHANGELOG.md", "build/*"],
      },
    ],
    "@semantic-release/github",
    "@semantic-release/npm",
  ],
};
