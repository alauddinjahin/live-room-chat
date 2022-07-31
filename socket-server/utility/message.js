import moment from "moment"

export default function formatMessage(name, text) {
    return {
      name,
      text,
      time: moment().format('h:mm a')
    };
}