const SearchForm = (props) => {
    return (
        <form onSubmit={props.utils[1]}>
            <input className='search-field' type='text' onChange={props.utils[0]} placeholder='Un-ask your question...' value={props.unsearch} />
        </form>
    )
}

export default SearchForm