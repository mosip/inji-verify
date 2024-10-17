const path = require('path');

module.exports = {
    process: (src, filename) => {
        return {
            code: `module.exports = {
                default: '${JSON.stringify(path.basename(filename))}',
                ReactComponent: 'div'
            };`
        };
    }
};
