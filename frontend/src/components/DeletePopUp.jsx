import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";

const DeletePopUp = ({
  data,
  deleteForAll: deleteAllFunction,
  deleteForMe: deleteMeFunction,
}) => {
  // deleteMessage(message._id)
  const [messageToDelete, setMessageToDelete] = useState(data.msg);
  const [canDeleteForAll, setCanDeleteForAll] = useState(data.isAuth);
  const uniqueId = `modal_${data.id}`;

  useEffect(() => {
    setMessageToDelete(data.msg);
    setCanDeleteForAll(data.isAuth);
  }, [data]);

  const confirmBox = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById(uniqueId).showModal();
  };

  const cancel = (e) => {
    e.stopPropagation();
  };

  const handleDeleteForAll = (e) => {
    e.stopPropagation();
    deleteAllFunction(data.id);
  };

  const handleDeleteForMe = (e) => {
    e.stopPropagation();
    deleteMeFunction(data.id);
  };

  return (
    <div>
      <Trash
        size={15}
        className="opacity-0 group-hover:opacity-50 transition-opacity duration-300 cursor-pointer"
        onClick={confirmBox}
      />
      <dialog id={uniqueId} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{messageToDelete}</h3>
          <div className="modal-action">
            <form method="dialog" className="flex gap-4">
              <button
                className="btn btn-md btn-outline btn-neutral"
                onClick={cancel}
              >
                Cancel
              </button>
              <button className="btn btn-neutral" onClick={handleDeleteForMe}>
                Delete for me
              </button>
              {canDeleteForAll && (
                <button
                  className="btn btn-neutral"
                  onClick={handleDeleteForAll}
                >
                  Delete for everyone
                </button>
              )}
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default DeletePopUp;
