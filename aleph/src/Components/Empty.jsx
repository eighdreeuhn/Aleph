const Empty = props => {

  return (
    <audio className="empty-question" autoPlay={false}>
      <source src="./resources/empty-question.m4a" type="audio/mp3" />
    </audio>
  );
};

export default Empty;
