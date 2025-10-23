const { Command } = require('commander');
const fs = require('fs');
const program = new Command();

program
  .requiredOption('-i, --input <path>', 'шлях до вхідного JSON-файлу')
  .option('-o, --output <path>', 'шлях до файлу для запису результату')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-h, --humidity', 'додати вивід вологості вдень (Humidity3pm)')
  .option('-r, --rainfall <number>', 'фільтр: лише записи, де кількість опадів більше за число')
  .configureOutput({
    outputError: (str, write) => {
    if (str.startsWith('error: required option \'-i'))
      write('We cannot cook, Jesse. There is no -i \n');
    else if (str.startsWith('error: option \'-o'))
      write('Is your program cannot find -o/output file? Then Better Call KaByH\n');
    else if (str.startsWith('error: option \'-i'))
      write('Oh, there is no path ? It was me, Dio\n');
    else if (str.startsWith('error: option \'-r'))
      write('Your next line is |Oh, I have to write a number after -r|\n');
    else
      write(str);
  }
});


program.parse(process.argv);
const options = program.opts();

if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(options.input));

let results = data.filter((rec) =>
  options.rainfall ? rec.Rainfall > parseFloat(options.rainfall) : true
).map((rec) => {
  let fields = [rec.Rainfall, rec.Pressure3pm];
  if (options.humidity) fields.push(rec.Humidity3pm);
  return fields.join(' ');
});

if (options.output) {
  fs.writeFileSync(options.output, results.join('\n'));
}
if (options.display) {
  console.log(results.join('\n'));
}

