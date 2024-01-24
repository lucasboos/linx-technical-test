from http import HTTPStatus

from .models import RecordModel


class RecordController:
    @classmethod
    def get_records_by_user(cls, user_id):
        records = RecordModel.get_records_by_user(user_id)
        records_json = [record.json for record in records]
        return records_json, HTTPStatus.OK

    @classmethod
    def get_record_by_id(cls, id):
        record = RecordModel.get_record_by_id(id)
        if record:
            return record.json, HTTPStatus.OK
        return {'message': 'Record not found'}, HTTPStatus.NOT_FOUND

    @classmethod
    def add_record(cls, user_id, searched_region):
        new_record = RecordModel(user_id=user_id, searched_region=searched_region)

        try:
            new_record.save_record()
        except Exception as e:
            return {'message': 'An internal error occurred.'}, HTTPStatus.INTERNAL_SERVER_ERROR

        return new_record.json, HTTPStatus.CREATED

    @classmethod
    def delete_record(cls, id):
        record = RecordModel.get_record_by_id(id)
        if not record:
            return {'message': 'Record not found'}, HTTPStatus.NOT_FOUND

        record.delete_record()

        return {'message': 'Record deleted successfully'}, HTTPStatus.OK

    @classmethod
    def delete_all_records_by_user(cls, user_id):
        try:
            RecordModel.delete_all_records_by_user(user_id)
            return {'message': 'All records deleted successfully'}, HTTPStatus.OK
        except Exception as e:
            return {'message': 'An internal error occurred.'}, HTTPStatus.INTERNAL_SERVER_ERROR
