import * as moment from 'moment';

export const handleOptionalFilterDate = (dtInicio: string, dtFim: string) => {
  const defaultDtInicio = '1900-01-01';
  const defaultDtFim = moment().format('YYYY-MM-DD');

  return {
    dtInicioCondition: dtInicio || defaultDtInicio,
    dtFimCondition: dtFim || defaultDtFim,
  };
};
