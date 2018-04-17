const resolveApp = require('../scripts/config/common');
const ext = require.resolve('./src/ext.js');

const file_list = {
    vendor: ['react', 'react-dom', ext]
};

module.exports = file_list;