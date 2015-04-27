export default function upsert(store, modelName, data) {
  var item = store.getById(modelName, data.id);
  if (item) {
    item.setProperties(data);
  } else {
    item = store.createRecord(modelName, data);
  }
  return item;
}
