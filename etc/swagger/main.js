const {
    parse,
    stringify,
    assign
  } = require('comment-json')

const path = require('path');  
const input = path.join(__dirname, './entries/jsonBody.json');
const output = path.join(__dirname, './entries/jsonBody.txt');
const fs = require('fs');

// This is a little utility to convert a annotated json with comments into something that can be used inside swagger.jsp
// To run this
// cd metamac-portal
// npm run setup
// npm run json-to-swagger
// Copy the jsonBody.txt output, it will have the jsonBody.json transformed into something you can paste into swagger.jsp

const obj = parse(fs.readFileSync(input, {encoding: 'utf-8'}).toString());
const parsed = stringify(obj, null, 4)
        .replace(new RegExp(/\n/, 'g'), '\\n')
        .replace(new RegExp('"', 'g'), '\\\"');
console.log(
        );

fs.writeFileSync(output, parsed);