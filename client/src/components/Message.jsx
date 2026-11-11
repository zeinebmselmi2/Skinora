function Message({ loading, error, success }) {
  return (
    <div className="messages">
      {loading && <p className="msg msg-loading">Chargement...</p>}
      {error && <p className="msg msg-error">{error}</p>}
      {success && <p className="msg msg-success">{success}</p>}
    </div>
  );
}

export default Message;
