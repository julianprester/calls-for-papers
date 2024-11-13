# Evaluation for GenAI Pipeline

1. Clean gold standard data
  - [x] DSS
  - [ ] IJIM
  - [ ] IM
  - [ ] IO
  - [ ] ISJ
  - [ ] ISR
  - [ ] JAIS
  - [ ] JASIST
  - [ ] JIT
  - [ ] JMIS
  - [ ] JSIS
  - [ ] MISQ
2. Write LLM parser script (take data.json raw data + **engineered prompt** => call datastructure)
3. Write eval script (take call datastructure and compare against gold standard datastructure)
  - Levenshtein distance as error rate for: title, topics (merged together), paragraphs (merged together), editors (name + affiliation merged together), associate editors (name + affiliation merged together), dates (date + description + deadline merged together)
  - This way we get an error rate for all the different data types
  - We can then aggregate the error rate (mean, median, **sum**, max?) per call
  - We can then also aggregate to the entire dataset (again mean, median, **sum**, max?)
4. Iterate on **engineered prompt** and minimize the error rate