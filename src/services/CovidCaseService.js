import axios from 'axios';
export const CovidCaseService = {
  getUsData: function() {
      return axios.get("https://corona.lmao.ninja/v2/jhucsse/counties")
  }
};