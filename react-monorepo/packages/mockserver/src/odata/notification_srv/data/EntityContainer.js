module.exports = {
    executeAction: function (actionDefinition, actionData, keys) {
        // console.log('Updating the data for ' + JSON.stringify(keys), actionDefinition, actionData);

        if (actionDefinition.name === 'FuGetBadgeNumber') {
            return {
                value: 2
            }
        } else if (actionDefinition.name === 'AcExecuteAction') {
            return {
                Success: true,
                Nature: 'Success',
                DeleteOnReturn: true,
                MessageText: 'Action executed successfully',
            }
        }
    }
};