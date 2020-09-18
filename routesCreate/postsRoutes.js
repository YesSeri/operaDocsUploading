const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const router = express.Router();
const db = require('../helper/dbConnection');

router.use(express.json());

router.get('/', (req, res) => {
  db.query('SELECT * FROM Pieces', function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

router.post('/', (req, res) => {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    const startPath = files.uploadedFile.path;
    const { description, type, opera, lastName, placement } = fields;
    const title = fields.title.trim();
    const operaId = await processOpera(opera);
    const subfolder = opera.replace(/\s/g, '_').toLowerCase();
    const fileFolder = path.join(__dirname, '..', '/pdfs/', subfolder);
    const fileTitle = `${lastName}-${opera}-${placement}-${title}.pdf`.replace(
      /\s/g,
      '_'
    );
    const document = {
      title: title,
      description: description.trim(),
      type: type.toLowerCase(),
      opera_id: operaId,
      file_title: path.join(subfolder, fileTitle),
      placement,
    };
    db.query('INSERT INTO Pieces SET ?', document, function (err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.header(200).json(document);
      console.log(document);
      copyFile(startPath, fileFolder, fileTitle);
    });
  });
});

async function processOpera(opera) {
  const operaId = await new Promise((resolve, reject) =>
    db.query(
      'SELECT id FROM `Operas` WHERE name = ? ',
      opera,
      (err, result) => {
        if (err) {
          reject(err);
          throw err;
        } else {
          resolve(result);
        }
      }
    )
  );
  return operaId[0].id;
}
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM Pieces WHERE id = ?', id, function (err, result) {
    if (err) throw err;

    if (Object.keys(result).length === 0) {
      res.send('Invalid ID');
    } else {
      res.send(result);
    }
  });
});

function copyFile(originPath, fileFolder, fileTitle) {
  if (!fs.existsSync(fileFolder)){
    fs.mkdirSync(fileFolder);
  }
  fs.copyFile(originPath, path.join(fileFolder, fileTitle), (err) => {
    if (err) throw err;
    console.log(`Copied: ${originPath} to: ${fileTitle}`);
  });
}

module.exports = router;
