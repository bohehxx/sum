export function pick(str) {
  var reg = /@#underline:([^\s]*?)\#@/g
  var ret = []
  var arr
  // eslint-disable-next-line
    while ((arr = reg.exec(str))) ret.push(arr[1]);
  return ret
}
