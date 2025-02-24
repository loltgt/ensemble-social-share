
import { argv, exit } from 'node:process';
import { copyFile, mkdir, access } from 'node:fs/promises';

const BASE_PATH = './node_modules';
const DEST_PATH = './project';

const IONICONS_PATH = `${BASE_PATH}/ionicons/src/svg`;
const SIMPLEICONS_PATH = `${BASE_PATH}/simple-icons/icons`;

const ICONS_DEFAULT = {
  ionicons: [{'share-social': 'web-share'}, {'print-outline': 'print'}, {'link-outline': 'copy-link'}, {'mail-outline': 'send-email'}, {'logo-linkedin': 'linkedin'}, {'logo-mastodon': 'mastodon'}, {'logo-skype': 'skype'}],
  simpleicons: ['bluesky', 'facebook', 'line', 'messenger', 'quora', 'reddit', 'snapchat', 'telegram', 'threads', 'viber', 'whatsapp', 'x']
};


try {
  try {
    await access(argv[4] ?? DEST_PATH);
  } catch (err) {
    if (err.code === 'ENOENT')
      await mkdir(argv[4] ?? DEST_PATH);
    else
      throw err;
  }
  console.log('folder', argv[4] ?? DEST_PATH);

  await access(IONICONS_PATH);
  await access(SIMPLEICONS_PATH);
} catch (err) {
  throw err;
}

switch (argv[2]) {
  case 'ionicons':
    copyFile(`${IONICONS_PATH}/${argv[3]}.svg`, argv[4] ?? DEST_PATH)
      .then(() => console.log('copied', argv[4] ?? DEST_PATH, `${IONICONS_PATH}/${argv[3]}.svg`))
      .catch(console.error);
  break;
  case 'simple-icons':
    copyFile(`${SIMPLEICONS_PATH}/${argv[3]}.svg`, argv[4] ?? DEST_PATH)
      .then(() => { console.log('copied', argv[4] ?? DEST_PATH, `${IONICONS_PATH}/${argv[3]}.svg`) })
      .catch(console.error);
  break;
  case '--default':
    for (const iconset in ICONS_DEFAULT) {
      const src_path = {ionicons: IONICONS_PATH, simpleicons: SIMPLEICONS_PATH}[iconset];

      for (const icon of ICONS_DEFAULT[iconset]) {
        let src = icon, dest = icon;

        if (typeof icon == 'object')
          [src, dest] = Object.entries(icon).flat();

        copyFile(`${src_path}/${src}.svg`, argv[4] ? `${argv[4]}/${dest}.svg` : `${DEST_PATH}/${dest}.svg`)
          .then(() => { console.log('copied', argv[4] ? `${argv[4]}/${dest}.svg` : `${DEST_PATH}/${dest}.svg`, `${src_path}/${src}.svg`) })
          .catch(console.error)
      }
    }
  break;
  default:
    exit(1);
}
