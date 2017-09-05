var test = require('tape')
var getAbi = require('../index').getAbi
var getTarget = require('../index').getTarget
var getNextTarget = require('../index')._getNextTarget

test('getNextTarget gets the next unsopported target', function (t) {
  var mockTargets = [
    {runtime: 'node', target: '7.0.0', abi: '51', lts: false},
    {runtime: 'node', target: '8.0.0', abi: '57', lts: false},
    {runtime: 'electron', target: '0.36.0', abi: '47', lts: false},
    {runtime: 'electron', target: '1.1.0', abi: '48', lts: false}
  ]
  t.equal(getNextTarget('node', mockTargets), '9.0.0')
  t.equal(getNextTarget('electron', mockTargets), '1.2.0')
  t.end()
})

test('getTarget calculates correct Node target', function (t) {
  t.equal(getTarget(undefined), process.versions.node)
  t.equal(getTarget(null), process.versions.node)
  t.equal(getTarget('11'), '0.10.4')
  t.equal(getTarget('14'), '0.11.11')
  t.equal(getTarget('46'), '4.0.0')
  t.equal(getTarget('47'), '5.0.0')
  t.equal(getTarget('48'), '6.0.0')
  t.equal(getTarget('51'), '7.0.0')
  t.end()
})

test('getTarget calculates correct Electron target', function (t) {
  t.throws(getTarget.bind(null, '14', 'electron'))
  t.equal(getTarget('47', 'electron'), '0.36.0')
  t.equal(getTarget('48', 'electron'), '1.1.0')
  t.equal(getTarget('49', 'electron'), '1.3.0')
  t.equal(getTarget('50', 'electron'), '1.4.0')
  t.end()
})

test('getAbi calculates correct Node ABI', function (t) {
  t.equal(getAbi(undefined), process.versions.modules)
  t.equal(getAbi(null), process.versions.modules)
  t.throws(function () { getAbi('a.b.c') })
  t.throws(function () { getAbi(getNextTarget('node')) })
  t.equal(getAbi('7.2.0'), '51')
  t.equal(getAbi('7.0.0'), '51')
  t.equal(getAbi('6.9.9'), '48')
  t.equal(getAbi('6.0.0'), '48')
  t.equal(getAbi('5.9.9'), '47')
  t.equal(getAbi('5.0.0'), '47')
  t.equal(getAbi('4.9.9'), '46')
  t.equal(getAbi('4.0.0'), '46')
  t.equal(getAbi('0.12.17'), '14')
  t.equal(getAbi('0.12.0'), '14')
  t.equal(getAbi('0.11.16'), '14')
  t.equal(getAbi('0.11.11'), '14')
  t.equal(getAbi('0.11.10'), '13')
  t.equal(getAbi('0.11.8'), '13')
  t.equal(getAbi('0.11.7'), '0x000C')
  t.equal(getAbi('0.11.0'), '0x000C')
  t.equal(getAbi('0.10.48'), '11')
  t.equal(getAbi('0.10.30'), '11')
  t.equal(getAbi('0.10.4'), '11')
  t.equal(getAbi('0.10.3'), '0x000B')
  t.equal(getAbi('0.10.1'), '0x000B')
  t.equal(getAbi('0.10.0'), '0x000B')
  t.equal(getAbi('0.9.12'), '0x000B')
  t.equal(getAbi('0.9.9'), '0x000B')
  t.equal(getAbi('0.9.8'), '0x000A')
  t.equal(getAbi('0.9.1'), '0x000A')
  t.equal(getAbi('0.9.0'), '1')
  t.equal(getAbi('0.8.0'), '1')
  t.equal(getAbi('0.2.0'), '1')
  t.end()
})

test('getAbi calculates correct Electron ABI', function (t) {
  t.throws(function () { getAbi(undefined, 'electron') })
  t.throws(function () { getAbi(getNextTarget('electron'), 'electron') })
  t.equal(getAbi('1.4.0', 'electron'), '50')
  t.equal(getAbi('1.3.0', 'electron'), '49')
  t.equal(getAbi('1.2.0', 'electron'), '48')
  t.equal(getAbi('1.1.0', 'electron'), '48')
  t.equal(getAbi('1.0.0', 'electron'), '47')
  t.equal(getAbi('0.37.0', 'electron'), '47')
  t.equal(getAbi('0.36.0', 'electron'), '47')
  t.equal(getAbi('0.35.0', 'electron'), '46')
  t.equal(getAbi('0.34.0', 'electron'), '46')
  t.equal(getAbi('0.33.0', 'electron'), '46')
  t.equal(getAbi('0.32.0', 'electron'), '45')
  t.equal(getAbi('0.31.0', 'electron'), '45')
  t.equal(getAbi('0.30.0', 'electron'), '44')
  t.end()
})

test('getAbi supports leading v', function (t) {
  t.equal(getAbi('v7.2.0'), '51')
  t.end()
})

test('getAbi returns abi if passed as target', function (t) {
  t.equal(getAbi('57'), '57')
  t.end()
})
