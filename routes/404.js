module.exports = (req, res) => {
  res.status(404).format({
    html: () => res.render('404'),
    json: () => res.send({ message: 'resource not found'}),
    xml: () => {
      res.write('<error>\n')
      res.write(' <message>resource not found</message>')
      res.end('</error>\n')
    },
    text: () => res.send('resource not found')
  })
}
