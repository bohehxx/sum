export function pick(str) {
  var reg = /@#under:([^\s]*?)\#@/g
  var ret = []
  var arr
    while ((arr = reg.exec(str))) ret.push(arr[1]);
  return ret
}
