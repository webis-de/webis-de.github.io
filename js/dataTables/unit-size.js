jQuery.fn.dataTable.ext.type.order['unit-size-pre'] = function ( data ) {
    var matches = data.match( /^(\d+[,\d]*(?:\.\d+)?)\s*([a-z]*)/i );
    // console.log(matches)
    var multipliers = {
        // b:  1,
        // bytes: 1,
        // kb: 1000,
        // kib: 1024,
        // mb: 1000000,
        // mib: 1048576,
        // gb: 1000000000,
        // gib: 1073741824,
        // tb: 1000000000000,
        // tib: 1099511627776,
        // pb: 1000000000000000,
        // pib: 1125899906842624
        k: 1000,
        m: 1000000,
        b: 1000000000
    };

    if (matches) {
        var str = matches[1];
        str = str.replace(/,/g, '.');
        if(matches[2] == 'K' || matches[2] == 'M' || matches[2] == 'B') {
            var multiplier = multipliers[matches[2].toLowerCase()];
        } else {
            var multiplier = 1;
        }

        return parseFloat( str ) * multiplier;
    } else {
        return -1;
    };
};
