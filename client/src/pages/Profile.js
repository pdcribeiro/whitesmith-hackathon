import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { db } from '../firebase';

export default function Profile() {
  const [skills, setSkills] = useState([{ id: '', name: 'loading...' }]);

  useEffect(() => {
    db.collection('skills')
      .get()
      .then(querySnapshot => [
        { id: '', name: 'select skill' },
        ...querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ])
      .then(setSkills);
  }, []);

  return (
    <Formik
      initialValues={{
        username: '',
        skills: [''],
        interests: [''],
      }}
      onSubmit={async (values, { resetForm }) => {
        console.dir('values', values);
        await db.collection('users').add(values);
        resetForm();
      }}
    >
      {({ values, isSubmitting }) => (
        <StyledForm>
          <label htmlFor="username">Username</label>
          <Field name="username" />
          <ErrorMessage name="username" component="div" />
          <Skills name="skills" skills={skills} selected={values.skills} />
          <Skills
            name="interests"
            skills={skills}
            selected={values.interests}
          />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </StyledForm>
      )}
    </Formik>
  );
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

function Skills({ name, skills, selected }) {
  return (
    <FieldArray name={name}>
      {({ insert, remove, push }) => (
        <>
          <label htmlFor={`${name}`}>
            {name.charAt(0).toUpperCase() + name.substring(1)}
          </label>
          <div id={name}>
            {selected.length > 0 &&
              selected.map((skill, index) => (
                <Skill key={index}>
                  <div>
                    <Field name={`${name}.${index}`} as="select">
                      {skills.map(({ id, name }, optIdx) => (
                        <option value={id} key={optIdx}>
                          {name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name={`${name}.${index}`} component="div" />
                  </div>
                  <div>
                    <button type="button" onClick={() => remove(index)}>
                      X
                    </button>
                  </div>
                </Skill>
              ))}
            <button type="button" onClick={() => push({ id: '' })}>
              +
            </button>
          </div>
        </>
      )}
    </FieldArray>
  );
}

const Skill = styled.div`
  display: flex;
`;
