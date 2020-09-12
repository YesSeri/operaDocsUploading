const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
const router = express.Router();
const db = require('../helper/dbConnectionLocal');
const fileFolder = path.join(__dirname, '..', '/pdfs/');

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
    const { title, description, type, opera, lastName, placement } = fields;
    console.log(title);
    const operaId = await processOpera(opera);
    const fileTitle = `${lastName}-${opera}-${placement}-${title}.pdf`.replace(/\s/g, '_');
    const document = {
      title,
      description,
      type: type.toLowerCase(),
      opera_id: operaId,
      fileTitle,
      placement,
    };
    db.query('INSERT INTO Pieces_test SET ?', document, function (err, result) {
      if (err) throw err;
      res.header(200).json(document);
      copyFile(startPath, fileFolder + fileTitle);
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

function copyFile(originPath, filePath) {
  fs.copyFile(originPath, filePath, (err) => {
    if (err) throw err;
    console.log(`Copied: ${originPath} to: ${filePath}`);
  });
}

module.exports = router;
