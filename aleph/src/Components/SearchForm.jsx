const SearchForm = props => {
  return (
    <div className='intro'>
        <h4>Not every question has an answer...</h4>
        <p>Aleph is an experiment in synaesthesia. Search for anything you'd like,
            just like you would with Google. Instead of a list of results, Aleph processes your
            search and turns it into a piece of generative music accompanied by a visual representation of the sound itself.</p>
      <form onSubmit={props.utils[1]}>
        <input
          className="search-field"
          type="text"
          onChange={props.utils[0]}
          placeholder="Un-ask your question..."
          value={props.unsearch}
        />
      </form>
    </div>
  );
};

export default SearchForm;
