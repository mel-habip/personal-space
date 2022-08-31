/**
 * Beautifies a given string 
 */
export function beautify(field) {
    if (typeof field !== 'string') {
        throw Error(`Expected string but got ${typeof field} at the beautifier function for ${JSON.stringify(field)}`);
    }

    let split_clone = [];

    for (let elem of field.split(/[-_]/)) {
        if (elem.includes('.')) {
            elem = elem.split('.').map(part => beautify(part)).join(' - ');
        }
        split_clone.push(elem);
    }

    let result = [];
    const wordMap = {
        rrsp: 'RRSP',
        srrsp: 'Spousal RRSP',
        rrif: 'RRIF',
        srrif: 'Spousal RRIF',
        lirrsp: 'Locked-in RRSP',
        rsp: 'RSP',
        eap: 'EAP',
        pep: 'PEP',
        pefp: 'PEFP',
        fpep: 'FPEP',
        dpep: 'DPEP',
        pedp: 'PEDP',
        hio: 'HIO',
        llc: 'LLC',
        lta: 'LTA',
        dtc: 'DTC',
        dap: 'DAP',
        us: 'US',
        ab: 'AB',
        bc: 'BC',
        bctesg: 'BCTESG',
        nbin: 'NBIN',
        clb: 'CLB',
        tcp: 'TCP',
        id: 'ID',
        pac: 'PAC',
        swp: 'SWP',
        eft: 'EFT',
        rif: 'RIF',
        lira: 'LIRA',
        lif: 'LIF',
        rlif: 'RLIF',
        prif: 'PRIF',
        lrif: 'LRIF',
        rlsp: 'RLSP',
        lrsp: 'LRSP',
        resp: 'RESP',
        rdsp: 'RDSP',
        giin: 'GIIN',
        itf: 'ITF',
        sin: 'SIN',
        tin: 'TIN',
        ssn: 'SSN',
        ipp: 'IPP',
        rpp: 'RPP',
        ta: 'TA',
        ips: 'IPS',
        tfsa: 'TFSA',
        one: '#1',
        two: '#2',
        three: '#3',
        four: '#4',
        five: '#5',
        six: '#6',
        seven: '#7',
        eight: '#8',
        nine: '#9',
        w8ben: 'W-8BEN',
        w8bene: 'W-8BEN-E',
        w8eci: 'W-8ECI',
        w8exp: 'W-8EXP',
        w8imy: 'W-8IMY',
        rc518: 'RC518',
        rc519: 'RC519',
        rc520: 'RC520',
        rc521: 'RC521',
        nr301: 'NR301',
        poa: 'POA',
        or: 'or',
        of: 'of',
        at: 'at',
        and: 'and',
        for: 'for',
        with: 'with',
        without: 'without',
        in: 'in',
        on: 'on',
        linkedin: 'LinkedIn'
    };

    for (const word of split_clone) {
        if (Object.keys(wordMap).includes(word.toLowerCase())) {
            result.push(wordMap[word.toLowerCase()]);
        } else if (Number(word) == word && word) {
            result.push(`#${word}`);
        } else {
            result.push(`${word.charAt(0).toUpperCase()}${word.slice(1)}`);
        }
    }
    return result.join(' ');
}