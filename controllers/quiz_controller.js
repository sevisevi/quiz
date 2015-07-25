var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  // se comprueba si se ha introducido una busqueda
  if(req.query.search){
    var cadena = '%' + req.query.search.replace(/ /g, "%") + '%';
    models.Quiz.findAll({where:["pregunta like ?", cadena]}).then(
      function(quizes){
        res.render('quizes/index', {quizes: quizes});
      }
    ).catch(function(error) { next(error);})
  } else {
    models.Quiz.findAll().then(
      function(quizes) {
        res.render('quizes/index.ejs', { quizes: quizes});
      }
    ).catch(function(error) { next(error);})
  }
};

// GET  /quizes?search=texto_a_buscar
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregtunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build( req.body.quiz );

// guarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');
  })	//Redirección HTTP (URL relativo) lista de preguntas
};
