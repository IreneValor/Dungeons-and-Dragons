import apiInstance from "./apiInstance";

class ContraptionService {
  constructor() {
    this.api = apiInstance;
  }

  create(data) {
    return this.api.post("/contraptions", data);
  }

  edit(id, data) {
    return this.api.put(`/contraptions/${id}`, data);
  }

  delete(id) {
    return this.api.delete(`/contraptions/${id}`);
  }

  getAll() {
    return this.api.get(`/contraptions`);
  }

  getOne(id) {
    return this.api.get(`/contraptions/${id}`);
  }
}

const contraptionService = new ContraptionService();

export default contraptionService;
