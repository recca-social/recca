import axios from "axios";

export default {
    create: function(exportObject){
        return axios.post("/api/media/create/", exportObject)
    },

    delete: function() {
        return axios.delete("api/media/delete/")
    },

    toggleActive: function(id) {
        return axios.get("api/media/active/" + id)
    }
}