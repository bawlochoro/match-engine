var validator = function(workdayRow, alightRow) {
    var errorMapping = {
        ALIGHT: {},
        WORKDAY: {}
    };
    if(workdayRow.Employment_Type === 'P' &&
        alightRow.BENEFITS_STATUS_CODE === 'INELG1') {
        errorMapping.WORKDAY.Employment_Type = '#ff0002';
        errorMapping.ALIGHT.BENEFITS_STATUS_CODE = '#ff0002';
    }

    if(workdayRow.Termination_Status === 'TRUE' &&
        new Date(workdayRow.Termination_Date) < new Date() && 
        workdayRow.Termination_Reason === 'Death' && 
        alightRow.BENEFITS_STATUS_CODE === 'DTH15') {
        errorMapping.WORKDAY.Termination_Status = '#02af50';
        errorMapping.WORKDAY.Termination_Date = '#02af50';
        errorMapping.WORKDAY.Termination_Reason = '#02af50';
        errorMapping.ALIGHT.BENEFITS_STATUS_CODE = '#02af50';
    } else if(workdayRow.Termination_Status &&
        workdayRow.Termination_Date &&
        workdayRow.Termination_Reason &&
        alightRow.BENEFITS_STATUS_CODE === 'TERM01') {
        errorMapping.WORKDAY.Termination_Status = '#00afee';
        errorMapping.WORKDAY.Termination_Date = '#00afee';
        errorMapping.WORKDAY.Termination_Reason = '#00afee';
        errorMapping.ALIGHT.BENEFITS_STATUS_CODE = '#00afee';
    }

    if(workdayRow.Leave_Status === 'TRUE' && 
        ["Regulatory > Family Medical Leave Act", "Company > Disability", "Personal > Health Reasons", "Regulatory > Uncertified Medical Leave", "Regulatory > Workers Compensation"].indexOf(workdayRow.Leave_Type) >= 0 &&
        alightRow.BENEFITS_STATUS_CODE === 'STDUN1') {
        errorMapping.WORKDAY.Leave_Status = '#feff02';
        errorMapping.WORKDAY.Leave_Type = '#feff02';
        errorMapping.ALIGHT.BENEFITS_STATUS_CODE = '#feff02';
    }  else if(workdayRow.Leave_Status === 'TRUE' && 
        ["Personal > Personal Leave", "Regulatory > Work Authorization Leave"].indexOf(workdayRow.LEAVE_TYPES) >= 0 &&
        alightRow.BENEFITS_STATUS_CODE === 'STDUN1') {
        errorMapping.WORKDAY.Leave_Status = '#00f0ff';
        errorMapping.WORKDAY.Leave_Type = '#00f0ff';
        errorMapping.ALIGHT.BENEFITS_STATUS_CODE = '#00f0ff';
    } else if(workdayRow.Leave_Status && workdayRow.LEAVE_TYPES && alightRow.BENEFITS_STATUS_CODE === 'ACTIVE') {
        errorMapping.WORKDAY.Leave_Status = '#ff0fff';
        errorMapping.WORKDAY.Leave_Type = '#ff0fff';
        errorMapping.ALIGHT.BENEFITS_STATUS_CODE = '#ff0fff';    
    }
    return errorMapping;
}

module.exports = validator;
