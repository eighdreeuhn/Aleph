# Aleph (naught)
## The un-search engine

### We all know that Google has the answers to most questions, but what about the questions that can't be answered?
#### Introducing Aleph, the service to turn to when the answer is less important than the question itself!

##### Google's name comes from the number googol, representing 1 x 10^ 100. It's a staggeringly large number, and meant to represent the vastness of the internet and the amount of information available. Aleph, the first letter of the Hebrew alphabet, is the symbol used in mathematics to represent infinty, and Aleph naught, represents the first order countable infinity.

I am learning the Tone.js library and using React for this project. The concept is simple: the user can enter a search in the input field (just like Google) but, instead of getting list of search results, Aleph converts the string into a series of musical notes and colors based on a pair of hashing functions, and returns a piece of music accompanied by visual animations as the music plays. I drew a lot of inspiration for this idea from the following demos listed in the Tone.js API [https://tonejs.github.io/demos].

Version one MVP will be able to handle any search and return one result.

#### Post MVP goals:

I would like to incorporate a set of sliders that control various aspects of the results:

BPM, color saturation, note tuning, etc...

Add a backend server to pre-process the string and store the search in a SQL database so that the user has the ability to look up the five most recent searches and their resiults.

I've dummied-up a pair of demos as proof-of-concept here:[https://github.com/eighdreeuhn/Aleph]

and a simple wireframe here[https://jamboard.google.com/d/1kDYUFCtN0zCCungTt47cD_e9ISTx50kxGEwmGiEPfww/viewer?f=3]

I'm keeping the design simple on purpose. Learning the library will be challenge in and of itself, and I would like the project to under-promise and over-deliver.